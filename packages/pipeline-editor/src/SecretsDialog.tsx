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

import * as React from 'react';
import { useState } from 'react';

import { PipelineService } from './PipelineService';

interface IProps {
  secrets: Array<any>;
}

export const SecretsDialog: React.FC<IProps> = ({ secrets }) => {
  const options = [
    { value: 'database', text: 'Database' },
    { value: 'generic', text: 'Generic' }
  ];

  const [selected, setSelected] = useState('database');
  const [secretsList, setSecretsList] = useState([...secrets]);

  const handleChange = (event: any): void => {
    setSelected(event.target.value);
  };

  /*const getSecret = async (connectionId: string): Promise<any> => {
    console.log('clicked secret >>>> ', connectionId);
    const resp = await PipelineService.getSecret(connectionId);
    console.log('got secret from server ::: ', resp);
  };*/

  const deleteSecret = async (connectionId: string): Promise<any> => {
    await PipelineService.deleteSecret(connectionId);
    secretsList.splice(
      secretsList.findIndex((x: any) => x.connectionId === connectionId),
      1
    );
    setSecretsList([...secretsList]);
  };

  return (
    <form className="elyra-dialog-form secrets-dialog">
      <div>
        <div>
          <label htmlFor="secretTypeSelect">Secret type</label>
          <select
            id="secretTypeSelect"
            name="connectionType"
            className="jp-mod-styled"
            value={selected}
            onChange={handleChange}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="connectionId">Secret ID</label>
          <br />
          <input
            type="text"
            name="connectionId"
            placeholder="Secret ID"
            className="secrets-input jp-mod-styled"
          />
        </div>
        {selected === 'database' ? (
          <div>
            <div>
              <label htmlFor="host">Host</label>
              <br />
              <input
                type="text"
                name="host"
                placeholder="Host"
                className="secrets-input jp-mod-styled"
              />
            </div>
            <div>
              <label htmlFor="port">Port</label>
              <br />
              <input
                type="number"
                name="port"
                placeholder="Port"
                className="secrets-input jp-mod-styled"
              />
            </div>
            <div>
              <label htmlFor="database">Database</label>
              <br />
              <input
                type="text"
                name="database"
                placeholder="Database"
                className="secrets-input jp-mod-styled"
              />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <br />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="secrets-input jp-mod-styled"
              />
            </div>
            <div>
              <label htmlFor="database">Password</label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="secrets-input jp-mod-styled"
              />
            </div>
          </div>
        ) : (
          <div>
            <div>
              <label htmlFor="extra">Generic secret (JSON format)</label>
              <br />
              <textarea
                rows={5}
                name="extra"
                className="secrets-textarea jp-mod-styled"
                placeholder="Generic secret (JSON format)"
              ></textarea>
            </div>
          </div>
        )}
      </div>
      <div>
        {secretsList && secretsList.length ? (
          <table className="secrets-table">
            <thead>
              <tr>
                <th className="text-align-left">Secret ID</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {secretsList.map(secret => (
                <tr key={secret.connection_id}>
                  <td className="text-align-left">{secret.connection_id}</td>
                  <td>
                    <span
                      className="delete-secret-btn"
                      onClick={async (): Promise<any> =>
                        await deleteSecret(secret.connection_id)
                      }
                    >
                      &#10005;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No secrets added yet</p>
        )}
      </div>
      <br />
    </form>
  );
};
