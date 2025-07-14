pipeline {
  agent any

  environment {
    ACR_NAME         = "stagingacr1234"                          
    ACR_LOGIN_SERVER = "${ACR_NAME}.azurecr.io"
    IMAGE_TAG        = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'github_cre', url: 'https://github.com/Cuong312004/mini-e-commerce-app-microservices.git', branch: 'main',
      }
    }

    stage('Login to ACR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'acr_cre', usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
          sh '''
            echo "$ACR_PASS" | docker login $ACR_LOGIN_SERVER -u "$ACR_USER" --password-stdin
          '''
        }
      }
    }

    stage('Build & Push Images') {
      parallel {
        stage('Auth Service') {
          steps {
            sh """
              docker build -t $ACR_LOGIN_SERVER/auth-service:$IMAGE_TAG backend/auth-service
              docker push $ACR_LOGIN_SERVER/auth-service:$IMAGE_TAG
            """
          }
        }

        stage('Product Service') {
          steps {
            sh """
              docker build -t $ACR_LOGIN_SERVER/product-service:$IMAGE_TAG backend/product-service
              docker push $ACR_LOGIN_SERVER/product-service:$IMAGE_TAG
            """
          }
        }

        stage('Order Service') {
          steps {
            sh """
              docker build -t $ACR_LOGIN_SERVER/order-service:$IMAGE_TAG backend/order-service
              docker push $ACR_LOGIN_SERVER/order-service:$IMAGE_TAG
            """
          }
        }

        stage('Frontend') {
          steps {
            sh """
              docker build -t $ACR_LOGIN_SERVER/frontend:$IMAGE_TAG frontend
              docker push $ACR_LOGIN_SERVER/frontend:$IMAGE_TAG
            """
          }
        }
      }
    }

    stage('Clean up') {
      steps {
        sh 'docker logout $ACR_LOGIN_SERVER'
        echo "All images built and pushed with tag: $IMAGE_TAG"
      }
    }
  }
}
