'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { setStoreReference } from '@/lib/api/baseAPI';

function ReduxProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        setStoreReference(store);
    }, []);

    return (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}
                onBeforeLift={() => {
                    setStoreReference(store);
                }}
            >
                {children}
            </PersistGate>
        </Provider>
    );
}

export { ReduxProvider };
export default ReduxProvider;