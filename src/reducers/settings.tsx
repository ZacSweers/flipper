/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Actions} from './index';
import os from 'os';
import electron from 'electron';

export enum Tristate {
  True,
  False,
  Unset,
}

export type Settings = {
  androidHome: string;
  enableAndroid: boolean;
  enableIOS: boolean;
  /**
   * If unset, this will assume the value of the GK setting.
   * Note that this setting has no effect in the open source version
   * of Flipper.
   */
  enablePrefetching: Tristate;
  jsApps: {
    webAppLauncher: {
      url: string;
      height: number;
      width: number;
    };
  };
};

export type Action =
  | {type: 'INIT'}
  | {
      type: 'UPDATE_SETTINGS';
      payload: Settings;
    };

export const DEFAULT_ANDROID_SDK_PATH = getDefaultAndroidSdkPath();

const initialState: Settings = {
  androidHome: getDefaultAndroidSdkPath(),
  enableAndroid: true,
  enableIOS: os.platform() === 'darwin',
  enablePrefetching: Tristate.Unset,
  jsApps: {
    webAppLauncher: {
      url: 'http://localhost:8888',
      height: 600,
      width: 800,
    },
  },
};

export default function reducer(
  state: Settings = initialState,
  action: Actions,
): Settings {
  if (action.type === 'UPDATE_SETTINGS') {
    return action.payload;
  }
  return state;
}

export function updateSettings(settings: Settings): Action {
  return {
    type: 'UPDATE_SETTINGS',
    payload: settings,
  };
}

function getDefaultAndroidSdkPath() {
  return os.platform() === 'win32' ? getWindowsSdkPath() : '/opt/android_sdk';
}

function getWindowsSdkPath() {
  const app = electron.app || electron.remote.app;
  return `${app.getPath('home')}\\AppData\\Local\\android\\sdk`;
}
