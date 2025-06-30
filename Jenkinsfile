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
        
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d --build'
                    
                    // Chờ và debug
                    sh 'sleep 30'
                    sh 'docker ps -a'
                    sh 'docker logs web || true'
                    
                    // Kiểm tra healthcheck
                    sh 'docker inspect --format="{{.State.Health.Status}}" web || true'
                    sh 'docker exec web cat /healthcheck.sh || true'
                    sh 'docker exec web curl -v http://localhost:3000/health || true'
                    
                    // Kiểm tra kết nối MongoDB
                    sh 'docker exec web node -e "require(\'mongoose\').connect(process.env.MONGODB_URI).then(() => console.log(\'OK\')).catch(e => console.error(e))" || true'
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
    }
}
