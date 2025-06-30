pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb-atlas-uri')  # Tạo credential trong Jenkins
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("badminton-web")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'docker stop badminton-web || true'
                    sh 'docker rm badminton-web || true'
                    sh "docker run -d -p 80:80 --name badminton-web -e MONGODB_URI='${env.MONGODB_URI}' badminton-web"
                }
            }
        }
    }
}
