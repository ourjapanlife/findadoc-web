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

    it('should update isLoading with the boolean passed to setIsLoading', () => {
        const loadingStore = useLoadingStore()

        loadingStore.setIsLoading(true);
        expect(loadingStore.isLoading).to.be.true;

        loadingStore.setIsLoading(false);
        expect(loadingStore.isLoading).to.be.false;

    });
})

