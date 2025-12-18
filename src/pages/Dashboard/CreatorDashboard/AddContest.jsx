import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const AddContest = () => {
  const axiosSecure = useAxiosSecure();
  const [deadline, setDeadline] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const contestData = {
      name: data.name,
      image: data.image,
      description: data.description,
      price: Number(data.price),
      prize: data.prize,
      taskInstruction: data.taskInstruction,
      category: data.category,
      deadline: deadline ? deadline.toISOString() : null,
    };

    try {
      await axiosSecure.post("/contests", contestData);
      Swal.fire({
        icon: "success",
        title: "Contest Added!",
        text: "Your contest has been submitted for admin approval.",
        timer: 3000,
        showConfirmButton: false,
      });
      reset();
      setDeadline(null);
      navigate("/dashboard/my-contests");
    } catch (error) {
      console.error("Contest creation failed:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not create contest. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
              Create New Contest
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Left Column */}
              <div className="space-y-6">
                {/* Contest Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Contest Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UI/UX Design Challenge 2025"
                    className={`input input-bordered input-lg w-full ${
                      errors.name ? "input-error" : ""
                    }`}
                    {...register("name", {
                      required: "Contest name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-error text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Image URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Image URL
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/contest-image.jpg"
                    className={`input input-bordered input-lg w-full ${
                      errors.image ? "input-error" : ""
                    }`}
                    {...register("image", {
                      required: "Image URL is required",
                    })}
                  />
                  {errors.image && (
                    <p className="text-error text-sm mt-1">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* Contest Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Contest Type
                    </span>
                  </label>
                  <select
                    className={`select select-bordered select-lg w-full ${
                      errors.category ? "select-error" : ""
                    }`}
                    {...register("category", {
                      required: "Contest type is required",
                    })}
                  >
                    <option value="">Select a category</option>
                    <option value="Design">Design</option>
                    <option value="Writing">Writing</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Business Idea">Business Idea</option>
                    <option value="Photography">Photography</option>
                    <option value="Video Editing">Video Editing</option>
                  </select>
                  {errors.category && (
                    <p className="text-error text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* entry Fee */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Entry Fee
                    </span>
                  </label>
                  <div className="input-group">
                    <span className="bg-primary text-primary-content text-lg font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="10.00"
                      className={`input input-bordered input-lg flex-1 ${
                        errors.price ? "input-error" : ""
                      }`}
                      {...register("price", {
                        required: "Entry fee is required",
                        min: { value: 0, message: "Fee cannot be negative" },
                      })}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-error text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Prize money */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Prize Money
                    </span>
                  </label>
                  <div className="input-group">
                    <span className="bg-primary text-primary-content text-lg font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="5,000"
                      className={`input input-bordered input-lg flex-1 ${
                        errors.prize ? "input-error" : ""
                      }`}
                      {...register("prize", {
                        required: "Prize money is required",
                      })}
                    />
                  </div>
                  {errors.prize && (
                    <p className="text-error text-sm mt-1">
                      {errors.prize.message}
                    </p>
                  )}
                </div>
              </div>

              {/* == Right Column == */}
              <div className="space-y-6">
                {/* description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Description
                    </span>
                  </label>
                  <textarea
                    placeholder="Describe your contest in detail..."
                    className={`textarea textarea-bordered textarea-lg h-40 w-full ${
                      errors.description ? "textarea-error" : ""
                    }`}
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-error text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Task */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Task Instruction
                    </span>
                  </label>
                  <textarea
                    placeholder="Explain what participants need to submit..."
                    className={`textarea textarea-bordered textarea-lg h-48 w-full ${
                      errors.taskInstruction ? "textarea-error" : ""
                    }`}
                    {...register("taskInstruction", {
                      required: "Task instruction is required",
                    })}
                  />
                  {errors.taskInstruction && (
                    <p className="text-error text-sm mt-1">
                      {errors.taskInstruction.message}
                    </p>
                  )}
                </div>

                {/* Deadline */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Deadline
                    </span>
                  </label>
                  <DatePicker
                    selected={deadline}
                    onChange={(date) => setDeadline(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    placeholderText="Select deadline date and time"
                    className={`input input-bordered input-lg w-full ${
                      !deadline ? "border-error focus:border-error" : ""
                    }`}
                  />
                  {!deadline && (
                    <p className="text-error text-sm mt-1">
                      Deadline is required
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-2 mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting || !deadline}
                  className="btn btn-primary btn-lg w-full text-xl font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-md"></span>
                      Submitting Contest...
                    </>
                  ) : (
                    "Create Contest"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContest;
