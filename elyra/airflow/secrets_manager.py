from elyra.airflow.api_client import AirflowApiClient


class AirflowSecretsManager:
    api_client = AirflowApiClient()

    @staticmethod
    def get_secret(name):
        secret = AirflowSecretsManager.api_client.get_connection(name)
        otuput = None
        if secret["extra"] is not None:
            output = secret["extra"]
        else:
            output = {}
            otuput["host"] = secret["host"]
            otuput["port"] = secret["port"]
            otuput["database"] = secret["database"]
            otuput["username"] = secret["username"]
            otuput["password"] = secret["password"]
        return output

    @staticmethod
    def delete_secret(name):
        AirflowSecretsManager.api_client.delete_connection(name)
        return f"Successfully deleted secret with id {name}"

    @staticmethod
    def create_db_secret(name, host, port, database, username, password):
        data = {
            "connectionId": name,
            "host": host,
            "port": port,
            "database": database,
            "username": username,
            "password": password,
        }
        AirflowSecretsManager.api_client.create_db_connection(data)
        return f"Successfully created secret with id {name}"

    @staticmethod
    def create_generic_secret(name, data: dict):
        input_data = {"connectionId": name, "extra": data}
        AirflowSecretsManager.api_client.create_generic_connection(input_data)
        return f"Successfully created secret with id {name}"

    @staticmethod
    def list_secrets():
        secrets = AirflowSecretsManager.api_client.list_connections()
        output = []
        connections = secrets["connections"]

        if connections is not None and len(connections) > 0:
            for item in connections:
                output.append({"secret_id": item["connection_id"], "value": "*****"})
        return output
