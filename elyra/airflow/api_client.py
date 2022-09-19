import json
import os

import requests


class AirflowApiClient:
    def __init__(self):
        self.base_url = os.getenv("AIRFLOW_API_URL", "http://localhost:8080/api/v1")
        self.auth_token = os.getenv("AIRFLOW_API_TOKEN", "Basic YWRtaW46YWRtaW4=")

    def do_request(self, method, url, data=None):
        headers = {"Authorization": self.auth_token, "Content-Type": "application/json"}

        if data is not None:
            data = json.dumps(data)

        resp = requests.request(method, url=f"{self.base_url}/{url}", data=data, headers=headers)
        return resp

    def list_connections(self):
        resp = self.do_request("GET", "connections")
        return resp.json()

    def create_db_connection(self, data: dict):
        conn = {
            "connection_id": data["connectionId"],
            "conn_type": "generic",
            "host": data["host"],
            "port": int(data["port"]),
            "login": data["username"],
            "password": data["password"],
            "schema": data["database"],
        }

        resp = self.do_request("POST", "connections", conn)
        return resp.json()

    def create_generic_connection(self, data: dict):
        conn = {"connection_id": data["connectionId"], "conn_type": "generic", "extra": data["extra"]}
        resp = self.do_request("POST", "connections", conn)
        return resp.json()

    def create_connection(self, data: dict):
        if data["connectionType"] == "database":
            return self.create_db_connection(data)
        return self.create_generic_connection(data)

    def get_connection(self, conn_id):
        resp = self.do_request("GET", f"connections/{conn_id}")
        return resp.json()

    def delete_connection(self, conn_id):
        self.do_request("DELETE", f"connections/{conn_id}")
        return True
