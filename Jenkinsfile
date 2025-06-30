pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_ATLAS_URI')
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/1sGu7/BadmintonWeb.git'
            }
        }

        
        stage('Verify MongoDB Connection') {
            steps {
                sh '''
                echo "Verifying MongoDB connection..."
                mongosh "${MONGODB_URI}" --eval "db.runCommand({ping:1})"
                '''
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
                # Dừng dịch vụ chiếm port nếu cần
                sudo systemctl stop nginx apache2 || true
                sleep 2
                
                # Triển khai ứng dụng
                docker-compose down || true
                docker-compose up -d
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                retry(5) {
                    sh '''
                    echo "Checking application health..."
                    curl -Ifs http://localhost:${APP_PORT}/products
                    '''
                    sleep 10
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend channel: '#deployments', 
                      message: "SUCCESS: Deployment ${BUILD_URL} completed"
        }
        failure {
            slackSend channel: '#deployments', 
                      message: "FAILED: Deployment ${BUILD_URL} failed"
            sh 'docker-compose down || true'
        }
    }
}
