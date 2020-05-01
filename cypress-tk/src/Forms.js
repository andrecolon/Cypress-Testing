import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

/// Validate Form through Yup
const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup
        .string('abc@xyz.com', 'Email already taken')
        .email("Must be a valid email address.")
        .required("Must include email address."),
    terms: yup.boolean().oneOf([true], "please agree to terms of use"),
    positions: yup.string(),
    password: yup.string()
        .required("Password must be 8 charaters or more")
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
});


export default function Form() {
    // can declare initialState once and use as initial state for form, for errors, and reset form
    const initialFormState = {
        name: "",
        email: "",
        password: "",
        positions: "",
        terms: ""
    };

    // temporary state used to set state
    const [post, setPost] = useState([]);

    // server error
    const [serverError, setServerError] = useState("");

    // managing state for our form inputs
    const [formState, setFormState] = useState(initialFormState);

    // control whether or not the form can be submitted if there are errors in form validation
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // managing state for errors. empty unless inline validation (validateInput) updates key/value pair to have error
    const [errors, setErrors] = useState(initialFormState);

    // inline validation, validating one key/value pair
    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name) // get the value out of schema at key "e.target.name" --> "name="
            .validate(e.target.value) // value in input
            .then(valid => {
                // if passing validation, clear any error
                setErrors({ ...errors, [e.target.name]: "" });
            })
            .catch(err => {
                // if failing validation, set error in state
                //console.log("error!", err);
                setErrors({ ...errors, [e.target.name]: err.errors[0] });
            });
    };

    // whenever state updates, validate the entire form. if valid, then change button to be enabled.
    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            //console.log("valid?", valid);
            setIsButtonDisabled(!valid);
        });
    }, [formState]);

    // onSubmit function
    const formSubmit = e => {
        e.preventDefault();

        // send out POST request with obj as second param, for us that is formState.
        axios
            .post("https://reqres.in/api/users", formState)
            .then(response => {
                // update temp state with value to display
                setPost(response.data);
                //console.log(response.data)

                // clear state, could also use 'initialState' here
                setFormState({
                    name: "",
                    email: "",
                    password: "",
                    positions: "",
                    terms: ""
                });

                // clear any server error
                setServerError(null);
            })
            .catch(err => {
                // this is where we could create a server error in the form!
                setServerError("oops! something happened!");
            });
    };


    // onChange function
    const inputChange = e => {
        e.persist(); // necessary because we're passing the event asyncronously and we need it to exist even after this function completes (which will complete before validateChange finishes)
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        }; // remember value of the checkbox is in "checked" and all else is "value"
        validateChange(e); // for each change in input, do inline validation
        setFormState(newFormData); // update state with new data
    };


    return (
        <form className="form-style-5" onSubmit={formSubmit}>
            {serverError ? <p className="error">{serverError}</p> : null}
            <label htmlFor="name">
                Name
        <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={inputChange}
                    value={formState.name}
                    data-cy="name"
                />
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>
            <label htmlFor="email">
                Email
        <input
                    type="text"
                    name="email"
                    onChange={inputChange}
                    value={formState.email}
                    data-cy="email"
                />
                {errors.email.length > 0 ? (
                    <p className="error">{errors.email}</p>
                ) : null}
            </label>
            <label htmlFor="text">
                Password
        <input
                    type="password"
                    name="password"
                    minLength="8"
                    onChange={inputChange}
                    value={formState.password}
                    data-cy="password"
                />
                {errors.password.length > 0 ? (
                    <p className="error">{errors.password}</p>
                ) : null}

            </label>

            <label htmlFor="positions">
                What would you like to help with?
        <select id="positions" name="positions" onChange={inputChange}>
                    <option value="">--Please choose an option--</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Yard Work">Yard Work</option>

                    <option value="Admin Work">Admin</option>

                    <option value="Tabling">Tabling</option>
                </select>
                {errors.positions.length > 0 ? (
                    <p className="error">{errors.positions}</p>
                ) : null}
            </label>

            <label htmlFor="terms" className="terms">
                <input
                    type="checkbox"
                    name="terms"
                    checked={formState.terms}
                    onChange={inputChange}
                />
        Terms &amp; Conditions
        {/* {errors.terms.length > 0 ? (
          <p className="error">{errors.terms}</p>
        ) : null} */}
            </label>
            <li>{JSON.stringify(post, null, 2)}</li>
            <button disabled={isButtonDisabled} type="submit">
                Submit
      </button>

        </form>


    );

}
