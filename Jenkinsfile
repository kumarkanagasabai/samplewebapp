pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout()
    }

    environment {
        BUILD_LOCATION = 'pr-merge-block'
    }

    stages {

        /* =====================
           CHECKOUT
        ====================== */
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        /* =====================
           PRE-MERGE (PR)
        ====================== */
        stage('Pre-Merge Validation') {
            when {
                expression { env.CHANGE_ID != null }
            }
            steps {
                script {

                    def compileSuccess = true
                    def failureReason = ''

                    try {
                        sh '''
                          dotnet restore
                          dotnet build
                        '''
                    } catch (e) {
                        compileSuccess = false
                        failureReason = 'Source Compilation Failed'
                        currentBuild.result = 'FAILURE'
                    }

                    def message = buildPreMergeMessage(
                        compileSuccess,
                        failureReason,
                        env.BUILD_LOCATION
                    )

                    postPrComment(message)

                    if (!compileSuccess) {
                        error('Pre-merge validation failed')
                    }
                }
            }
        }

        /* =====================
           POST-MERGE (MAIN)
        ====================== */
        stage('Post-Merge Build') {
            when {
                allOf {
                    branch 'main'
                    expression { env.CHANGE_ID == null }
                }
            }
            steps {
                sh '''
                  dotnet restore
                  dotnet build -c Release
                  dotnet publish -c Release
                '''
            }
        }
    }
}

/* ======================================================
   HELPER METHODS
====================================================== */

def buildPreMergeMessage(boolean compileSuccess, String reason, String location) {
    if (compileSuccess) {
        return """
[Pre-Merge Status]
CI Status: SUCCESS ✅
Source Compilation: SUCCESS ✅
Build Location: ${location}
""".trim()
    } else {
        return """
[Pre-Merge Status]
CI Status: FAILURE ❌
Source Compilation: FAILURE ❌
Build Location: ${location}
Failure Reasons: ${reason}
""".trim()
    }
}

@NonCPS
def parseGitHubRepo(String repoUrl) {
    def pattern = 'github\\.com[:/](.+?)/(.+?)(\\.git)?$'
    def matcher = (repoUrl =~ pattern)

    if (!matcher) {
        throw new RuntimeException("Cannot parse GitHub repo from URL: ${repoUrl}")
    }

    return [matcher[0][1], matcher[0][2]]
}

def postPrComment(String message) {
    echo "DEBUG: CHANGE_ID=${env.CHANGE_ID}"
    echo "DEBUG: BRANCH_NAME=${env.BRANCH_NAME}"

    if (!env.CHANGE_ID) {
        echo "Not a PR build. Skipping PR comment."
        return
    }

    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {

        // Extract org/repo from SCM URL
        def repoUrl = scm.userRemoteConfigs[0].url
        def (org, repo) = parseGitHubRepo(repoUrl)

        sh """
        cat <<EOF > pr_comment.json
        {
          "body": ${groovy.json.JsonOutput.toJson(message)}
        }
        EOF

        curl -s -X POST \
          -H "Authorization: token $GITHUB_TOKEN" \
          -H "Accept: application/vnd.github+json" \
          https://api.github.com/repos/${org}/${repo}/issues/${env.CHANGE_ID}/comments \
          -d @pr_comment.json
        """
    }
}
