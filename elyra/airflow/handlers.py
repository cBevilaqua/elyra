#
# Copyright 2018-2022 Elyra Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_unescape
from tornado import web

from elyra.airflow.api_client import AirflowApiClient
from elyra.util.http import HttpErrorMixin


class AirflowSecretsHandler(HttpErrorMixin, APIHandler):
    """Handler for secrets list and create."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.api_client = AirflowApiClient()

    @web.authenticated
    async def get(self):
        try:
            resp = self.api_client.list_connections()
        except Exception as err:
            raise web.HTTPError(500, repr(err)) from err

        self.set_status(200)
        self.set_header("Content-Type", "application/json")
        await self.finish({"airflow_connections": resp})

    @web.authenticated
    async def post(self):
        resp = None
        try:
            payload = self.get_json_body()
            resp = self.api_client.create_connection(payload)
        except Exception as err:
            raise web.HTTPError(500, repr(err)) from err

        self.set_status(201)
        self.set_header("Content-Type", "application/json")
        self.finish(resp)


class AirflowSecretsItemHandler(HttpErrorMixin, APIHandler):
    """Handler for secrets get and delete."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.api_client = AirflowApiClient()

    @web.authenticated
    async def get(self, airflow_connection_id):
        conn_id = url_unescape(airflow_connection_id)
        resp = None
        try:
            resp = self.api_client.get_connection(conn_id)
        except Exception as err:
            raise web.HTTPError(500, repr(err)) from err

        self.set_status(200)
        self.set_header("Content-Type", "application/json")
        await self.finish(resp)

    @web.authenticated
    async def delete(self, airflow_connection_id):
        conn_id = url_unescape(airflow_connection_id)
        try:
            self.api_client.delete_connection(conn_id)
        except Exception as err:
            raise web.HTTPError(500, repr(err)) from err

        self.set_status(204)
        self.finish()
