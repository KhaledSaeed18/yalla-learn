function createNoopStorage() {
    return {
        getItem: function (key: string) {
            return Promise.resolve(null);
        },
        setItem: function (key: string, value: any) {
            return Promise.resolve(value);
        },
        removeItem: function (key: string) {
            return Promise.resolve();
        }
    };
}

const storage = typeof window !== 'undefined'
    ? require('redux-persist/lib/storage').default
    : createNoopStorage();

export default storage;