pipeline {
     agent any
     




    stages {
         stage('Bootstrap .NET SDK') {
  steps {
    sh '''
      set -e
      curl -fsSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
      chmod +x dotnet-install.sh
      ./dotnet-install.sh --channel 8.0 --install-dir "$HOME/dotnet"
      export PATH="$HOME/dotnet:$PATH"
      dotnet --info
    '''
  }
}
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
