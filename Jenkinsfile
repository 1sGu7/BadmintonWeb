pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb-atlas-uri')
    }

    stages {
        stage('Cleanup') {
            steps {
                script {
                    // Dừng và xóa container cũ
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Giải phóng port 3000
                    sh 'docker stop $(docker ps -q --filter ancestor=badminton-web-app) || true'
                    sh 'docker rm $(docker ps -aq --filter ancestor=badminton-web-app) || true'
                    
                    // Xóa mạng cũ
                    sh 'docker network prune -f'
                }
            }
        }
        
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d --build'
                    sh 'sleep 30' // Chờ đủ thời gian khởi động
                    sh 'docker logs web'
                    sh 'docker-compose ps'
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af'
        }
    }
}
