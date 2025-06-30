pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_ATLAS_URI')
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                // Sử dụng deleteDir thay vì cleanWs để tránh lỗi quyền
                deleteDir()
                git branch: 'main', 
                url: 'https://github.com/1sGu7/BadmintonWeb.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build --no-cache'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                # Dừng và xóa container cũ
                docker-compose down -v --remove-orphans || true
                
                # Triển khai mới với volume
                docker-compose up -d
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                retry(5) {
                    script {
                        sleep 15  // Tăng thời gian chờ
                        sh '''
                        echo "Checking application health..."
                        curl -Is http://localhost:${APP_PORT}/products | head -1
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Ghi log để debug
            sh 'docker-compose logs --tail 100 web || true'
            sh 'docker-compose logs --tail 100 mongo || true'
            
            // Sử dụng deleteDir an toàn
            deleteDir()
        }
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed!'
            sh 'docker-compose down -v || true'
        }
    }
}
