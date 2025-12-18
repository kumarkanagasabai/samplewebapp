pipeline {
     agent {
        dockerContainer {
            image 'mcr.microsoft.com/dotnet/sdk:8.0'
            args '-v $HOME/.nuget/packages:/root/.nuget/packages'
        }
    }

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
                sh 'dotnet build'
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
