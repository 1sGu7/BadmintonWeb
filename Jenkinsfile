pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('mongodb-atlas-uri')
    }

    stages {
        stage('Cleanup') {
            steps {
                script {
                    sh 'docker-compose down -v --remove-orphans || true'
                    sh 'docker stop $(docker ps -q) || true'
                    sh 'docker rm $(docker ps -aq) || true'
                    sh 'docker network prune -f'
                    sh 'docker volume prune -f'
                }
            }
        }
        
        stage('Debug Connection') {
            steps {
                script {
                    // In giá trị MONGODB_URI (đã mask)
                    sh 'echo "MONGODB_URI=${MONGODB_URI}" | sed \'s/:.*@/:*****@/\''
                    
                    // Test kết nối MongoDB bằng Node.js
                    sh '''
                        node -e "
                          const mongoose = require('mongoose');
                          const uri = process.env.MONGODB_URI;
                          console.log('Testing MongoDB connection with URI:', uri.replace(/:[^@]+@/, ':*****@'));
                          
                          // Mã hóa URI
                          const encodedURI = encodeURI(uri);
                          console.log('Encoded URI:', encodedURI.replace(/:[^@]+@/, ':*****@'));
                          
                          mongoose.connect(encodedURI, { serverSelectionTimeoutMS: 5000 })
                            .then(() => {
                              console.log('✅ MongoDB connection successful');
                              process.exit(0);
                            })
                            .catch(err => {
                              console.error('❌ MongoDB connection failed:', err);
                              process.exit(1);
                            });
                        "
                    '''
                }
            }
        }
        
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d --build'
                    sh 'sleep 30'
                    sh 'docker logs web'
                }
            }
        }
    }

    post {
        always {
            sh 'docker-compose logs --no-color > docker-logs.txt'
            archiveArtifacts artifacts: 'docker-logs.txt', fingerprint: true
            sh 'docker system prune -af'
        }
        failure {
            // Thêm bước để tránh lỗi cú pháp
            echo 'Pipeline failed. Check the logs for details.'
            
            // Có thể thêm hành động khác như gửi email thông báo
            // emailext subject: 'Pipeline Failed', body: 'Check ${BUILD_URL}'
        }
    }
}
