.PHONY: install build test dev preview docker-build docker-run

install:
	npm ci

build:
	npm run build

test:
	npm test

dev:
	npm run dev

preview:
	npm run preview -- --host 0.0.0.0 --port 4321

docker-build:
	docker build -t portfolio:local .

docker-run:
	docker run --rm -p 4321:4321 portfolio:local
