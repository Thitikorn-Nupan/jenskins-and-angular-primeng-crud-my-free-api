// the first start with pipeline { set up agent and stages inside pipeline }
pipeline {
    // any คือ ใช้ executor ใด ๆ ก็ได้
    agent any
    environment {
            // you have to call tru env.<var name> ex, env.DOMAIN
            DOCKER_IMAGE_NAME = 'ui-app'
            DOCKER_CONTAINER_NAME = 'angular-and-nginx'
            DOCKER_NGINX_PORT_REMOTE = '8080'
    }

    // stages as working Flows tell Pipeline what gonna do
    stages {

            stage('Before initial check software installed') {
                steps {
                      sh 'node --version'
                      sh 'git --version'
                      sh 'docker --version'
                }
            }


            stage('Checkout git repo') {
                steps {
                    // Checks out the source code from your Git repository. *** Note, by default it will pull repo to C:\ProgramData\Jenkins\.jenkins\workspace\...
                    git branch: 'ttknp', url: 'https://github.com/Thitikorn-Nupan/jenskins-and-angular-primeng-crud-my-free-api.git'
                }
            }

// bug fix later
//             stage('Before build docker container ui') {
//                 steps {
//                    // this case terminal can't run build
//                    sh "npm run build"
//                 }
//                 post {
//                      success {
//                          echo 'After build on local successfully.'
//                      }
//                 }
//             }

            stage('Build docker container ui') {
                steps {
                   sh "docker build -t ${env.DOCKER_IMAGE_NAME} -f dockers/angular/Dockerfile ."
                }
                post {
                     success {
                         echo 'After build successfully.'
                         sh 'docker images' // check is image create
                     }
                }
            }



           stage('Deploy docker image ui') {
                steps {
                   sh "docker run --name ${DOCKER_CONTAINER_NAME} -d -p ${env.DOCKER_NGINX_PORT_REMOTE}:8000 ${env.DOCKER_IMAGE_NAME}"
                }
                post {
                     success {
                         echo 'After run successfully.'
                         sh 'docker ps' // check is container running create
                     }
                }
           }

        }

        // The post section can be defined at both the global Pipeline level and within individual stage blocks, allowing for granular control over post-execution actions.
        post {
                /*
                    always: Steps within this block execute regardless of the Pipeline's or stage's final status (success, failure, unstable, aborted).
                    success: Steps execute only if the Pipeline or stage completes successfully.
                    failure: Steps execute only if the Pipeline or stage fails.
                    unstable: Steps execute only if the Pipeline or stage completes with an "unstable" status.
                    aborted: Steps execute only if the Pipeline or stage is aborted.
                    changed: Steps execute if the current run's status differs from the previous run's status.
                    fixed: Steps execute if the current run is successful and the previous run was either failed or unstable.
                    regression: Steps execute if the current run's status is worse than the previous run's status (e.g., successful to unstable, unstable to failure).
                    cleanup: This is a special condition within the global post section, primarily used for tasks like workspace cleanup, regardless of the build result.
                 */
                 success { // If some it is failure success won't work
                     echo 'Pipeline deploy angular + docker completed successfully.'
                 }
                 failure { // After failure on stages alert this still alert too (last process)
                     echo 'Pipeline deploy angular + docker failed.'
                 }
        }
    }
