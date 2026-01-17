from fastapi import Query
from fastapi import APIRouter, Body
from app.services.token_company_service import TokenCompanyService
import os

router = APIRouter()

api_key = os.getenv("TOKEN_COMPANY_API_KEY")
if api_key is None:
    raise RuntimeError("No TOKEN_COMPANY_API_KEY found in environment")

token_company_service = TokenCompanyService(api_key=api_key)


@router.post("/compress")
def compress(aggressiveness: float = Query(le=0.9), text: str = Body(..., embed=True)):
    api_response = token_company_service.make_request(text, aggressiveness)
    return {"response": api_response}
