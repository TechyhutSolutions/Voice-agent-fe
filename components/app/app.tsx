'use client';

import { useMemo } from 'react';
import { TokenSource } from 'livekit-client';
import {
  RoomAudioRenderer,
  SessionProvider,
  StartAudio,
  useSession,
} from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { getSandboxTokenSource } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function useCurrentUrlContext() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const app = searchParams.get('app');

  return {
    pathname,
    app,
  };
}

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {

  const { pathname, app } = useCurrentUrlContext();
  console.log("App Pathname:", pathname);
  console.log("App Query Param 'app':", app);
  const tokenSource = useMemo(() => {
    // if app == "HC" use /api/connection-detail-hc
    if (app === "healthcare") {
      return typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT_HC === 'string'
        ? getSandboxTokenSource(appConfig)
        : TokenSource.endpoint('/api/connection-detail-hc');
    }
    return typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string'
      ? getSandboxTokenSource(appConfig)
      : TokenSource.endpoint('/api/connection-details');
  }, [appConfig]);

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  );

  return (
    <SessionProvider session={session}>
      <AppSetup />
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController appConfig={appConfig} />
      </main>
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
      <Toaster />
    </SessionProvider>
  );
}
