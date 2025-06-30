pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb-atlas-uri')
    }

    stages {
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose up -d --build'
                    
                    // Thêm các lệnh kiểm tra
                    sh 'sleep 10' // Đợi 10s cho container khởi động
                    sh 'docker ps'
                    sh 'docker logs web'
                    sh 'docker logs nginx'
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
