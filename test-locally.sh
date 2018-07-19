docker stack rm sherlock-webserver
sleep 1
docker network create frontend --scope swarm --driver overlay
sleep 1
docker-compose build
sleep 1
docker stack deploy -c docker-compose.yml sherlock-webserver
sleep 1
echo "Listening on http://127.0.0.1:52417"
