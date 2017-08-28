import {createStore, applyMiddleware} from 'redux'
import {attach} from 'khufu-runtime'
import createSagaMiddleware from 'redux-saga'

import {main} from './counter.khufu'

attach(document.getElementById('app'), main(), {
    store(reducer, middleware, state) {
        let sagas = []
        let middle = middleware.map(m => {
            if(m.saga) {
                let sm = createSagaMiddleware()
                sagas.push([sm, m.saga])
                return sm
            } else {
                return m
            }
        })
        let store = createStore(reducer, state,
            applyMiddleware(...middle))
        for(let [mid, saga] of sagas) {
            mid.run(saga)
        }
        return store
    }
})

if(module.hot) {
    module.hot.accept()
}
