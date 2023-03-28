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
import { Cron } from 'react-js-cron';
import 'antd/dist/antd.css';
import 'react-js-cron/dist/styles.css';

// https://www.npmjs.com/package/react-js-cron
// https://www.npmjs.com/package/antd

interface IProps {
  cronExpression: string;
}

export const SchedulerDialog: React.FC<IProps> = ({ cronExpression }) => {
  const [value, setValue] = useState(cronExpression);

  return (
    <form className="elyra-dialog-form">
      <Cron value={value} setValue={setValue} />
      <input name="cronExpression" type="hidden" value={value} />
      <br />
    </form>
  );
};