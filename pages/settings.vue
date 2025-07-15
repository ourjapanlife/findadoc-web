<template>
    <div class="min-h-screen bg-primary-bg pt-20 px-4">
        <div class="max-w-2xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-primary">Settings</h1>
                <p class="text-gray-600">Manage your account settings</p>
            </div>

            <div class="bg-white rounded-lg shadow p-6 mb-8">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-primary mb-3">Display Name</h2>
                    <input
                        type="text"
                        value="John Doe"
                        placeholder="Enter your display name"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                </div>

                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-primary mb-3">Profile Image</h2>
                    <div class="flex items-center gap-6">
                        <img
                            src="~/assets/icons/profile-icon.svg"
                            alt="profile icon"
                            class="w-20 h-20 rounded-full border-2 border-gray-200"
                        />
                        <div class="flex-1">
                            <input
                                type="text"
                                placeholder="Enter image URL"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            />
                            <p class="text-sm text-gray-500 mt-2">Enter a URL to your profile image</p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button class="px-6 py-3 bg-primary text-white rounded-lg font-medium">
                        Update Settings
                    </button>
                </div>
            </div>

            <div class="text-center">
                <img
                    src="~/assets/icons/characters-chico-therapy-dog-primary.svg"
                    alt="Chiko the therapy dog"
                    class="w-32 h-32 mx-auto mb-4"
                />
            </div>
        </div>
    </div>
</template> 