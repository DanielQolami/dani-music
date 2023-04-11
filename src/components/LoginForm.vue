<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label for="email-1" class="inline-block mb-2">{{
        $t("loginForm.email")
      }}</label>
      <vee-field
        type="email"
        name="email"
        id="email-1"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label for="password-1" class="inline-block mb-2">{{
        $t("loginForm.password")
      }}</label>
      <div class="relative">
        <vee-field
          name="password"
          :type="passwordType"
          id="password-1"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <span
          class="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500 leading-5 cursor-pointer"
          @click="toggleShowPassword"
        >
          <i
            class="fas"
            :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"
          ></i>
        </span>
      </div>
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      :disabled="login_in_submission"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      {{ $t("loginForm.submit") }}
    </button>
  </vee-form>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      showPassword: false,
      loginSchema: {
        email: "required|email",
        password: "required|min:3|max:32",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Please wait! We are logging you in.",
    };
  },
  computed: {
    passwordType() {
      return this.showPassword ? "text" : "password";
    },
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    async login(values) {
      this.login_in_submission = true;
      this.login_show_alert = true;
      this.login_alert_variant = "bg-blue-500";
      this.login_alert_msg = "Please wait! We are logging you in.";

      try {
        await this.$store.dispatch("login", values);
      } catch (error) {
        this.login_in_submission = false;
        this.login_alert_variant = "bg-red-500";
        switch (error.code) {
          case "auth/invalid-email":
            this.login_alert_msg = "Invalid Email address.";
            break;
          case "auth/user-disabled":
            this.login_alert_msg =
              "The user corresponding to the given email has been disabled.";
            break;
          case "auth/wrong-password":
            this.login_alert_msg = "Wrong password!";
            break;
          default:
            this.login_alert_msg = "Invalid login details.";
        }

        return;
      }

      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "Success! You are logged in.";
      window.location.reload();
    },
  },
};
</script>
