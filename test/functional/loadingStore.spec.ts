import { setActivePinia, createPinia } from "pinia";
import { useLoadingStore } from "@/stores/loadingStore";
import { expect } from "chai";

describe('LoadingStore', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    });

    it('should initialize with default values', () => {
        const loadingStore = useLoadingStore()
        expect(loadingStore.isLoading).to.be.false;
    });
})

