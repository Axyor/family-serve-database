#!/bin/bash

echo "Connexion à MongoDB et affichage des groupes..."
docker exec database-mongodb-1 mongosh \
    -u test_user \
    -p test_password \
    --authenticationDatabase admin \
    family-serve-test \
    --eval "db.groups.find().pretty()"
