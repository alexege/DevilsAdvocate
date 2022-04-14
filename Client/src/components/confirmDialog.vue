<template>
    <popup-modal ref="popup" >
        <div class="background">
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>
            <div class="btns">
                <button class="cancel-btn" @click="_cancel">{{ cancelButton }}</button>
                <span class="ok-btn" @click="_confirm">{{ okButton }}</span>
            </div>
        </div>
    </popup-modal>
</template>
<script>
import PopupModal from './popupModal.vue'

export default {
    name: 'ConfirmDialog',

    components: { PopupModal },

    data: () => ({
        // Parameters that change depending on the type of dialog
        title: undefined,
        message: undefined, // Main text content
        okButton: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
        cancelButton: 'Cancel', // text for cancel button
        
        // Private variables
        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message
            this.okButton = opts.okButton
            if (opts.cancelButton) {
                this.cancelButton = opts.cancelButton
            }
            // Once we set our config, we tell the popup modal to open
            this.$refs.popup.open()
            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _confirm() {
            this.$refs.popup.close()
            this.resolvePromise(true)
        },

        _cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
            // Or you can throw an error
            // this.rejectPromise(new Error('User cancelled the dialog'))
        },
    },
}
</script>
<style scoped>

 /* {
    background-color: rgba(255, 255, 255, 0.5);
} */

.btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.ok-btn {
    padding: 0.5em 1em;
    background-color: black;
    color: #ff0000;
    border: 2px solid #ff0000;
    border-radius: 5px;
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;
}

.ok-btn:hover {
    background-color: #ff0000;
    color: black;
    border: 1px solid black;
}

.cancel-btn {
    padding: 0.5em 1em;
    /* background-color: rgba(0, 0, 0, 0); */
    background-color: black;
    color: #1DB954;
    border: 2px solid #1DB954;
    border-radius: 5px;
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #1DB954;
    color: black;
    border: 1px solid black;
}
</style>