
default:
	echo "Please specify a command (run/frontend/backend)"

run:
	make frontend
	make backend

backend:
	make backend_deps
	make backend_run
backend_deps:
	cd backend && composer install && php artisan key:generate
backend_run:
	cd backend && ./vendor/bin/sail up

frontend:
	make frontend_deps
	make frontend_run
frontend_deps:
	cd frontend && npm install
frontend_run:
	cd frontend && npm start

.PHONY: backend frontend