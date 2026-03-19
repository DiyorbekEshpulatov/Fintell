
import requests

def test_web3_status():
    response = requests.get("http://localhost:3001/web3/status")
    assert response.status_code == 200
    assert response.json()["status"] == "connected"

def test_web3_balance():
    response = requests.get("http://localhost:3001/web3/balance/0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B")
    assert response.status_code == 200
    assert "address" in response.json()
    assert "balance_eth" in response.json()

def test_create_user():
    new_user = {
        "fullName": "Test User",
        "phone": "+998901234567"
    }
    response = requests.post("http://localhost:3001/users", json=new_user)
    assert response.status_code == 201
    created_user = response.json()[0]
    assert created_user["fullName"] == new_user["fullName"]
    assert created_user["phone"] == new_user["phone"]
