<template>
  <div
    class="text-white text-center font-bold p-5 mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label for="name-1" class="inline-block mb-2">{{
        $t("registerForm.name")
      }}</label>
      <vee-field
        type="text"
        name="name"
        id="name-1"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
      <!-- name should math the name in our input element -->
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("registerForm.email") }}</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("registerForm.age") }}</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("registerForm.password") }}</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }"
        ><!-- bails will tell the vee, not to show only the first error it sees. but to show all errors -->
        <div class="relative">
          <input
            :type="passwordType"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password"
            v-bind="field"
          /><span
            class="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500 leading-5 cursor-pointer"
            @click="toggleShowPassword"
          >
            <i
              class="fas"
              :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"
            ></i>
          </span>
        </div>
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{
        $t("registerForm.confPassword")
      }}</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("registerForm.country") }}</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">{{ $t("registerForm.country_usa") }}</option>
        <option value="Mexico">{{ $t("registerForm.country_mexico") }}</option>
        <option value="Germany">
          {{ $t("registerForm.country_germany") }}
        </option>
        <option value="Iran">{{ $t("registerForm.country_iran") }}</option>
        <option value="Venezuela">
          {{ $t("registerForm.country_venezuela") }}
        </option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        :validateOnInput="true"
      />
      <i18n-t class="inline-block" keypath="registerForm.accept" tag="label">
        <a href="./tos" target="_blank">{{ $t("registerForm.TOS") }}</a>
      </i18n-t>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button
      type="submit"
      :disabled="reg_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      {{ $t("loginForm.submit") }}
    </button>
  </vee-form>
</template>

<script>
// "@" symbol will tell webpack to go to "src" folder

export default {
  name: "RegisterForm",
  data() {
    return {
      showPassword: false,
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:3|max:32",
        confirm_password: "passwords_mismatch:@password",
        country: "required|country_excluded:Venezuela",
        tos: "tos",
      },
      userData: {
        country: "Iran",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "Please wait! Your account is being created.",
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
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-blue-500";
      this.reg_alert_msg = "Please wait! Your account is being created.";

      /*
      let userCred = null;
	    try {
        userCred = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-500";
        switch (error.code) {
          case "auth/email-already-in-use":
            this.reg_alert_msg = "Email already in use.";
            break;
          case "auth/invalid-email":
            this.reg_alert_msg = "Invalid Email address.";
            break;
          case "auth/operation-not-allowed":
            this.reg_alert_msg = "Operation not allowed.";
            break;
          case "auth/weak-password":
            this.reg_alert_msg = "Weak password!";
            break;
          default:
            this.reg_alert_msg =
              "An Unexpected error occured. Please try again, later.";
        }

        return;
      }
	    */

      try {
        await this.$store.dispatch("register", values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-500";
        switch (error.code) {
          case "auth/email-already-in-use":
            this.reg_alert_msg = "Email already in use.";
            break;
          case "auth/invalid-email":
            this.reg_alert_msg = "Invalid Email address.";
            break;
          case "auth/operation-not-allowed":
            this.reg_alert_msg = "Operation not allowed.";
            break;
          case "auth/weak-password":
            this.reg_alert_msg = "Weak password!";
            break;
          default:
            this.reg_alert_msg =
              "An Unexpected error occured. Please try again, later.";
        }

        return;
      }

      this.reg_alert_variant = "bg-green-500";
      this.reg_alert_msg = "Success! your account is created.";
      window.location.reload();
    },
  },
};
</script>
