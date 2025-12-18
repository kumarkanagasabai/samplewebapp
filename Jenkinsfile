pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Build step"
                echo "Build number: ${env.BUILD_NUMBER}"
            }
        }
    }
    post {
        success {
            echo "Build succeeded"
        }
        failure {
            echo "Build failed"
        }
    }
}
