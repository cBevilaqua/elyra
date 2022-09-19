/*
 * Copyright 2018-2022 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RequestErrors, showFormDialog } from '@elyra/ui-components';
import { Dialog, ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';
import { IDisposable } from '@lumino/disposable';

import * as React from 'react';

import { formDialogWidget } from './formDialogWidget';
import { PipelineService } from './PipelineService';
import { SecretsDialog } from './SecretsDialog';

/**
 * Secrets button extension
 *  - Attach button to editor toolbar to open SecretsDialog
 */

export class SecretsButtonExtension<
  T extends DocumentWidget,
  U extends DocumentRegistry.IModel
> implements DocumentRegistry.IWidgetExtension<T, U> {
  showWidget = async (document: T): Promise<void> => {
    const connectionsResp = await PipelineService.getSecrets();

    const secrets = [];

    if (
      connectionsResp &&
      connectionsResp.airflow_connections &&
      connectionsResp.airflow_connections.connections &&
      connectionsResp.airflow_connections.connections.length
    ) {
      for (
        let x = 0;
        x < connectionsResp.airflow_connections.connections.length;
        x += 1
      ) {
        secrets.push({
          connection_id:
            connectionsResp.airflow_connections.connections[x].connection_id
        });
      }
    }

    const dialogOptions: Partial<Dialog.IOptions<any>> = {
      title: 'Manage Secrets',
      body: formDialogWidget(<SecretsDialog secrets={secrets} />),
      buttons: [Dialog.cancelButton(), Dialog.okButton()],
      defaultButton: 1
      // focusNodeSelector: '#pipeline_name'
    };

    const dialogResult = await showFormDialog(dialogOptions);

    if (dialogResult.value === null) {
      return;
    }

    const secret: any = {
      connectionType: dialogResult.value.connectionType,
      connectionId: dialogResult.value.connectionId
    };

    if (secret.connectionType === 'database') {
      secret.host = dialogResult.value.host;
      secret.port = dialogResult.value.port;
      secret.username = dialogResult.value.username;
      secret.password = dialogResult.value.password;
      secret.database = dialogResult.value.database;
    } else {
      secret.extra = dialogResult.value.extra;
    }

    await PipelineService.createSecret(secret).catch(error =>
      RequestErrors.serverError(error)
    );
  };

  createNew(editor: T): IDisposable {
    // Create the toolbar button
    const secretsButton = new ToolbarButton({
      label: 'Manage Secrets',
      onClick: (): any => this.showWidget(editor),
      tooltip: 'Manage Airflow Secrets / Connections'
    });

    // Add the toolbar button to the editor
    console.log('will add button to toolbar');
    editor.toolbar.insertItem(11, 'openSecrets', secretsButton);
    console.log('toolbar after adding button >>>>>> ', editor.toolbar);
    // The ToolbarButton class implements `IDisposable`, so the
    // button *is* the extension for the purposes of this method.
    return secretsButton;
  }
}
