pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = 'poc'
        IMAGE_TAG = "latest"
        ECR_URL = "614601912331.dkr.ecr.ap-south-1.amazonaws.com/poc/poc"
        CLUSTER_NAME = 'simplewebpoc'
        SERVICE_NAME = 'simplewebpoc-service'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'echo "Building Docker Image..."'
                sh 'docker build -t $ECR_URL:$IMAGE_TAG .'
                sh 'echo "build completed.."'
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                     credentialsId: 'aws-credentials']
                ]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $ECR_URL
                    '''
                }
            }
        }

        stage('Push to ECR') {
            steps {
                sh 'docker push $ECR_URL:$IMAGE_TAG'
            }
        }

        stage('Prepare Task Definition') {
            steps {
                sh '''
                sed "s|<ECR_IMAGE_URL>|$ECR_URL:$IMAGE_TAG|g" task-def.json > task-def-final.json
                '''
            }
        }

        stage('Register Task & Update Service') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                     credentialsId: 'aws-credentials']
                ]) {
                    sh '''
                    aws ecs register-task-definition --cli-input-json file://task-def-final.json
                    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment
                    '''
                }
            }
        }
    }
}
