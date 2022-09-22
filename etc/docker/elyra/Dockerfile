# syntax=docker/dockerfile:experimental
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

# Ubuntu 20.04.2 LTS (Focal Fossa)
# Repository: https://hub.docker.com/r/jupyterhub/k8s-singleuser-sample/tags
FROM jupyterhub/k8s-singleuser-sample:1.2.0

ARG TAG="dev"
ARG ELYRA_VERSION
ARG ELYRA_PACKAGE=elyra-"$ELYRA_VERSION"-py3-none-any.whl

COPY $ELYRA_PACKAGE requirements.txt ./

# Install Elyra
RUN if [ "$TAG" = "dev" ] ; then \
    python3 -m pip install --quiet --no-cache-dir "$ELYRA_PACKAGE"[all] && rm $ELYRA_PACKAGE; \
    else \
    python3 -m pip install --quiet --no-cache-dir elyra[all]=="$TAG" ; fi

# Install custom requirements
RUN python3 -m pip install -r requirements.txt && rm requirements.txt

# Install component examples catalogs
#  - this wail fail if the 'kfp-examples' pip extra is not installed
#RUN elyra-metadata create component-catalogs \
#    --schema_name=elyra-kfp-examples-catalog  \
#    --display_name="Kubeflow Pipelines examples" \
#    --runtime_type=KUBEFLOW_PIPELINES \
#    --categories="['examples']"

# switch to root to install linux packages
USER root

# Install Zoox required packages
RUN apt-get update -y\
  && apt-get install vim -y\
  && apt-get install nano -y\
  && apt-get install openssh-client -y\
  && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb\
  && apt-get install ./google-chrome-stable_current_amd64.deb -y\
  && apt-get install default-jdk -y

# Add microsoft sql server driver
RUN apt-get update -y\
  && apt-get install lsb-release -y\
  && apt-get install curl -y\
  && apt-get install gnupg -y\
  && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -\
  && curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list > /etc/apt/sources.list.d/mssql-release.list\
  && apt-get update\
  && ACCEPT_EULA=Y apt-get install msodbcsql18 -y\
  && apt install unixodbc-dev -y

# switch to NB_USER again
USER ${NB_USER}

# Copy Elyra entrypoint
COPY --chmod=0755 --chown=root:root start-elyra.sh /usr/local/bin/start-elyra.sh

CMD ["/usr/local/bin/start-elyra.sh"]
