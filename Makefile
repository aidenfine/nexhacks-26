.PHONY: backend frontend

backend:
	cd backend && uvicorn app.main:app --reload

frontend:
	cd frontend && pnpm run dev