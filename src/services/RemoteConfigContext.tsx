import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { remoteConfig } from "./firebase";

import {
  config as defaultConfig
} from '../helpers/constants';
import { AppConfig } from 'common/types';
import { ec2Instance } from './buzzle-sdk/types';


interface IProps {
  value?: any;
  children?: ReactNode;
}
interface ConfigContext extends AppConfig {
  isConfigLoading: boolean;
  configError: Error | null;

}
const defaultValues: ConfigContext = {
  ...defaultConfig,
  isConfigLoading: true,
  configError: null,
  instances: []


};

const RemoteConfigContext = createContext<ConfigContext>(defaultValues);

function useConfig(): ConfigContext {
  const context = useContext(RemoteConfigContext);
  if (!context) {
    console.log('useConfig must be used within a RemoteConfigProvider');
  }
  return context;
}

function RemoteConfigProvider(props: IProps) {
  const [constants, setConstants] = useState<{ config: AppConfig }>({ config: defaultConfig });
  const [isConfigLoading, setIsConfigLoading] = useState<boolean>(true);
  const [configError, setConfigError] = useState<Error | null>(null);
  const [instances, setInstances] = useState<Array<ec2Instance>>([])
  const keysTofetch = [
    'config',
  ];
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
      //fetch remote config and set constants
      setConfigError(null);
      setIsConfigLoading(true);
      await remoteConfig.fetchAndActivate();
      let result: any = await fetch(`${process.env.REACT_APP_API_URL || ""}/status/instances`)
      if (result.ok) {
        result = await result.json()
        setInstances(result)
      } else {
        result = []
      }
      // setConstants(
      //   Object.assign(
      //     { instances: result },
      //     ...keysTofetch.map((key) => ({
      //       [key]: JSON.parse(remoteConfig.getValue(key).asString()),
      //     })),
      //   ),
      // );
      setIsConfigLoading(false);
    } catch (err) {
      setIsConfigLoading(false);
      setConstants({ config: defaultConfig })

    }
  };
  const value = useMemo(() => {
    return { ...({ ...constants.config, instances }), isConfigLoading, configError };
  }, [constants, isConfigLoading, configError]);

  return <RemoteConfigContext.Provider value={value} {...props} />;
}

export { RemoteConfigProvider, useConfig };
