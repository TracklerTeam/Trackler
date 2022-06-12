<template>
    <div class="grayOut" @click="goBack">
        <div class="background" @click.stop>
            <h1 class="header-text">Register</h1>
            <div class="forms">
            <FormKit
                    type="text"
                    label="Email"
                    v-model="email"
                    outer-class="form-username"
                    validation="required|email"
                    @keydown.enter="register"
                    />
                <FormKit
                    type="text"
                    label="Username"
                    v-model="username"
                    outer-class="form-username"
                    validation="required"
                    @keydown.enter="register"
                    />
                <FormKit
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    v-model="password"
                    validation="required"
                    :sections-schema="{
                        suffix: {
                            $el: 'ion-icon',
                            attrs: {
                                name: 'eye-outline',
                                style: {
                                    marginRight: '10px',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer'
                                },
                                class: 'showPassword'
                            }
                        }
                    }"
                    @keydown.enter="register"
                    />
            </div>
            <div class="links-container">
                <router-link class="link" to="/login">I already have an account</router-link>
            </div>
            <button class="button" @click="register">Register</button>
        </div>
    </div>
</template>

<script lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/userStore";

export default{
    name: "Register",
    data: () => {
        return {
            username: "",
            password: "",
            email: "",
            showPassword: false
        }
    },
    mounted: function() {
        document.getElementsByClassName("showPassword")[0].addEventListener("click", this.toggleShowPassword);
    },
    methods: {
        goBack: () => {
            router.push('/');
        },
        toggleShowPassword: function() {
            this.showPassword = !this.showPassword;
            document.getElementsByClassName("showPassword")[0].setAttribute("name", this.showPassword ? "eye-off-outline" : "eye-outline");
        },
        register: async function() {
            if(this.username && this.password && this.email) {
                const response = await useUserStore().register(this.username, this.email, this.password);
                if(response.failed) {
                    this.$toast.open({
                        message: response.error,
                        type: "error",
                        duration: 10000,
                        queue: false               
                    });
                } else {
                    this.$toast.open({
                        message: "Successfully registered",
                        type: "success",
                        duration: 10000,
                        queue: false               
                    });
                    router.push('/login');
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.grayOut {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #D9D9D9;
    opacity: 0.75;
    z-index: 100;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .background {
        position: fixed;
        width: 35vw;
        height: 75vh;
        background-color: #E9EAED;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .header-text {
            font-family: 'Source Sans 3';
            font-style: normal;
            font-weight: 700;
            font-size: 32px;
            line-height: 46px;
            margin-top: 40px;
        }

        .forms {
            display: flex;
            flex-direction: column;
            align-items: space-between;
            justify-content: center;
            background: inherit;
        }

        .links-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .link {
                font-family: 'Source Sans 3';
                font-style: normal;
                font-weight: 600;
                font-size: 18px;
                line-height: 24px;
                color: #292A2C;
                margin-bottom: 16px;

                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                    color: #1E68FC;
                }
            }
        }

        .button {
            background-color: #1E68FC;
            border: 0;

            font-family: 'Source Sans 3';
            font-style: normal;
            font-weight: 600;
            font-size: 24px;
            line-height: 18px;
            /* identical to box height, or 129% */

            text-align: center;
            text-transform: uppercase;

            color: #FFFFFF;
            padding: 16px;
            padding-left: 60px;
            padding-right: 60px;
            min-width: 200px;

            cursor: pointer;

            &:hover {
                background-color: #105bf3;
            }
        }
    }
}
</style>