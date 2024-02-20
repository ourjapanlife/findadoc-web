import { setActivePinia, createPinia } from 'pinia'
import { useModalStore } from '@/stores/modalStore';
import { expect } from 'chai';

describe('ModalStore', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    });

    it('should initialize with default values', () => {
        const modalStore = useModalStore()
        expect(modalStore.isOpen).to.be.false;
    });

    it('should update isOpen when showModal is called', () => {
        const modalStore = useModalStore()
        modalStore.showModal();
        expect(modalStore.isOpen).to.be.true;
    });

    it('should update isOpen when hideModal is called', () => {
        const modalStore = useModalStore()
        modalStore.showModal();
        modalStore.hideModal();
        expect(modalStore.isOpen).to.be.false;
    });
});
