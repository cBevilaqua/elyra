from elyra.airflow.api_client import AirflowApiClient


class AirflowSecretsManager:
    api_client = AirflowApiClient()

    @staticmethod
    def get_secret(name):
        secret = AirflowSecretsManager.api_client.get_connection(name)
        if "status" in secret and secret["status"] == 404:
            return "Secret not found!"

        output = None

        if secret["extra"] is not None:
            return secret["extra"]
        else:
            output = {}
            output["host"] = secret["host"]
            output["port"] = secret["port"]
            output["database"] = secret["schema"]
            output["username"] = secret["login"]
            # output["password"] = secret["password"]
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
            "port": int(port),
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
