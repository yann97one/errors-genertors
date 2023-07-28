# Exercice de Recrutement - Développement Fullstack - Alternance


## Description

Bienvenue dans cet exercice de recrutement pour le poste de développeur Fullstack - alternance. Dans cet exercice, vous devrez utiliser le squelette de base fourni pour développer une application qui répond à certaines exigences.

## Description du squelette

Le squelette fourni constitue une base de départ pour le développement de l'application. Il est basé sur les technologies suivantes :

- ReactJS (TypeScript) pour le développement du frontend.
- FastAPI (Python) pour le développement du backend.
- MySQL (en Docker) pour la gestion de la base de données.

## Fonctionnalité attendue

L'objectif de cet exercice est de développer une application capable de gérer des erreurs générées de manière aléatoire par le backend, puis de les afficher et de permettre leur filtrage et leur tri dans le frontend via des websockets.

Plus précisément, voici les étapes à suivre pour implémenter cette fonctionnalité :

- Le backend doit générer aléatoirement des erreurs à intervalles réguliers.
- Les erreurs générées par le backend doivent être transmises au frontend via des websockets.
- Le frontend doit afficher les erreurs reçues du backend.
- Le frontend doit permettre à l'utilisateur de filtrer les erreurs en fonction de critères spécifiques.
- Le frontend doit également permettre à l'utilisateur de trier les erreurs affichées selon différents critères.

## Lancer le projet

Il faut d'abord installer les éléments suivants : 
- Docker et docker-compose
- Poetry
- npm

Une fois tout installé, il suffit de lancer les différents services : 

Lancer la base de données:
```
    docker-compose up -d --build
``` 
Lancer le front-end
```
    cd client
    npm install
    npm run dev
``` 

Lancer le server
```
    cd server
    poetry install
    poetry run uvicorn --reload --log-level info --port 8000 main:app
``` 



## Bonus
- Il est aussi envisageable si vous estimez que c'est plus simple pour vous d'ajouter un linter/formatter sur chaque service
- Si vous voulez dockerizer les front/back c'est aussi envisageable il y a des tutoriels en ligne pour

## Documentation utile

- https://react.dev/

- https://python-poetry.org/

- https://fastapi.tiangolo.com/

- https://pymysql.readthedocs.io/en/latest/

- https://socket.io/