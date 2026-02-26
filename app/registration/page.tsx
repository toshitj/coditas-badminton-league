"use client";

import { useRef, useState } from "react";

export const dynamic = 'force-dynamic';
import { motion } from "framer-motion";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import TeamRevealModal from "@/components/TeamRevealModal";
import { registerTeam, convertFileToBase64 } from "@/lib/api";
import { Loader2, CheckCircle2, X } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const jersey_size_options = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

const phone_schema = z.string().regex(/^\d{10}$/, "Must be a 10-digit number");
const dob_schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter DOB");
const jersey_number_schema = z.string().regex(/^\d{1,3}$/, "Jersey number must be numeric");
const jersey_size_schema = z.enum(jersey_size_options, { message: "Select a valid jersey size" });
const coditas_email_schema = z
  .string()
  .email("Invalid email address")
  .refine((value) => value.trim().toLowerCase().endsWith("@coditas.com"), "Please use coditas email");

const registrationSchema = z.object({
  malePlayer1Name: z.string().min(2, "Name must be at least 2 characters"),
  malePlayer1Email: coditas_email_schema,
  malePlayer1Dob: dob_schema,
  malePlayer1ContactNumber: phone_schema,
  malePlayer1WhatsAppNumber: phone_schema,
  malePlayer1Address: z.string().min(2, "Address is required"),
  malePlayer1EmployeeId: z.string().min(2, "Employee ID is required"),
  malePlayer1JerseyNumber: jersey_number_schema,
  malePlayer1JerseyName: z.string().min(1, "Jersey name is required"),
  malePlayer1JerseySize: jersey_size_schema,

  malePlayer2Name: z.string().min(2, "Name must be at least 2 characters"),
  malePlayer2Email: coditas_email_schema,
  malePlayer2Dob: dob_schema,
  malePlayer2ContactNumber: phone_schema,
  malePlayer2WhatsAppNumber: phone_schema,
  malePlayer2Address: z.string().min(2, "Address is required"),
  malePlayer2EmployeeId: z.string().min(2, "Employee ID is required"),
  malePlayer2JerseyNumber: jersey_number_schema,
  malePlayer2JerseyName: z.string().min(1, "Jersey name is required"),
  malePlayer2JerseySize: jersey_size_schema,

  femalePlayer1Name: z.string().min(2, "Name must be at least 2 characters"),
  femalePlayer1Email: coditas_email_schema,
  femalePlayer1Dob: dob_schema,
  femalePlayer1ContactNumber: phone_schema,
  femalePlayer1WhatsAppNumber: phone_schema,
  femalePlayer1Address: z.string().min(2, "Address is required"),
  femalePlayer1EmployeeId: z.string().min(2, "Employee ID is required"),
  femalePlayer1JerseyNumber: jersey_number_schema,
  femalePlayer1JerseyName: z.string().min(1, "Jersey name is required"),
  femalePlayer1JerseySize: jersey_size_schema,

  femalePlayer2Name: z.string().min(2, "Name must be at least 2 characters"),
  femalePlayer2Email: coditas_email_schema,
  femalePlayer2Dob: dob_schema,
  femalePlayer2ContactNumber: phone_schema,
  femalePlayer2WhatsAppNumber: phone_schema,
  femalePlayer2Address: z.string().min(2, "Address is required"),
  femalePlayer2EmployeeId: z.string().min(2, "Employee ID is required"),
  femalePlayer2JerseyNumber: jersey_number_schema,
  femalePlayer2JerseyName: z.string().min(1, "Jersey name is required"),
  femalePlayer2JerseySize: jersey_size_schema,

  transactionId: z.string().min(5, "Transaction ID must be at least 5 characters"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactNumber: phone_schema,
  refundUpiId: z.string().min(3, "Refund UPI ID is required"),
  paymentProof: z.any()
    .refine((file) => file?.[0], "Payment proof is required")
    .refine(
      (file) => file?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png formats are supported"
    ),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

type PlayerPrefix = "malePlayer1" | "malePlayer2" | "femalePlayer1" | "femalePlayer2";

function PlayerFields({
  prefix,
  labelPrefix,
  register,
  errors,
}: {
  prefix: PlayerPrefix;
  labelPrefix: string;
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
}) {
  type FieldName = keyof RegistrationFormData & string;

  const field_error = (field: FieldName): string | undefined => {
    const message = (errors as Record<string, { message?: unknown }>)[field]?.message;
    return typeof message === "string" ? message : undefined;
  };

  const field_id = (suffix: string) => `${prefix}${suffix}`;

  const render_text_field = ({
    suffix,
    label,
    type = "text",
    placeholder,
    inputMode,
    list,
    maxLength,
    sanitizeDigitsMax,
  }: {
    suffix: string;
    label: string;
    type?: string;
    placeholder?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    list?: string;
    maxLength?: number;
    sanitizeDigitsMax?: number;
  }) => {
    const name = field_id(suffix) as FieldName;
    const message = field_error(name);
    const field = register(name as keyof RegistrationFormData);

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          inputMode={inputMode}
          list={list}
          maxLength={maxLength}
          {...field}
          onChange={(e) => {
            if (sanitizeDigitsMax) {
              const digits_only = e.target.value.replace(/\D/g, "");
              e.target.value = digits_only.slice(0, sanitizeDigitsMax);
            } else if (typeof maxLength === "number" && maxLength > 0) {
              e.target.value = e.target.value.slice(0, maxLength);
            }

            field.onChange(e);
          }}
          className={message ? "border-red-500" : ""}
        />
        {message ? <p className="text-red-500 text-sm">{message}</p> : null}
      </div>
    );
  };

  const jersey_size_list_id = `${prefix}-jersey-size`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {render_text_field({ suffix: "Name", label: `${labelPrefix} Name *` })}
        {render_text_field({ suffix: "Email", label: `${labelPrefix} Email *`, type: "email" })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {render_text_field({ suffix: "Dob", label: `${labelPrefix} DOB *`, type: "date" })}
        {render_text_field({
          suffix: "ContactNumber",
          label: `${labelPrefix} Contact Number *`,
          inputMode: "numeric",
          maxLength: 10,
          sanitizeDigitsMax: 10,
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {render_text_field({
          suffix: "WhatsAppNumber",
          label: `${labelPrefix} WhatsApp Number *`,
          inputMode: "numeric",
          maxLength: 10,
          sanitizeDigitsMax: 10,
        })}
        {render_text_field({ suffix: "EmployeeId", label: `${labelPrefix} Employee ID *` })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {render_text_field({ suffix: "Address", label: `${labelPrefix} Address *` })}
        {render_text_field({
          suffix: "JerseyNumber",
          label: `${labelPrefix} Jersey Number *`,
          inputMode: "numeric",
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {render_text_field({ suffix: "JerseyName", label: `${labelPrefix} Jersey Name *` })}
        <div className="space-y-2">
          <Label htmlFor={`${prefix}JerseySize`}>{`${labelPrefix} Jersey Size *`}</Label>
          <Input
            id={`${prefix}JerseySize`}
            list={jersey_size_list_id}
            {...register(`${prefix}JerseySize` as keyof RegistrationFormData)}
            className={field_error(`${prefix}JerseySize` as FieldName) ? "border-red-500" : ""}
          />
          <datalist id={jersey_size_list_id}>
            {jersey_size_options.map((size) => (
              <option key={size} value={size} />
            ))}
          </datalist>
          {field_error(`${prefix}JerseySize` as FieldName) ? (
            <p className="text-red-500 text-sm">{field_error(`${prefix}JerseySize` as FieldName)}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [fileName, setFileName] = useState("");
  const [qrSrc, setQrSrc] = useState<string>("/assets/qr-code.png");
  const { toast } = useToast();
  const paymentProofInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    shouldFocusError: false,
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    try {
      const file = data.paymentProof[0];
      
      const paymentScreenshotBase64 = await convertFileToBase64(file);

      const payload: Record<string, string> = {
        "Male Player 1 Name": data.malePlayer1Name,
        "Male Player 1 Email": data.malePlayer1Email,
        "Male Player 1 DOB": data.malePlayer1Dob,
        "Male Player 1 Contact Number": data.malePlayer1ContactNumber,
        "Male Player 1 WhatsApp Number": data.malePlayer1WhatsAppNumber,
        "Male Player 1 Address": data.malePlayer1Address,
        "Male Player 1 Employee ID": data.malePlayer1EmployeeId,
        "Male Player 1 Jersey Number": data.malePlayer1JerseyNumber,
        "Male Player 1 Jersey Name": data.malePlayer1JerseyName,
        "Male Player 1 Jersey Size": data.malePlayer1JerseySize,

        "Male Player 2 Name": data.malePlayer2Name,
        "Male Player 2 Email": data.malePlayer2Email,
        "Male Player 2 DOB": data.malePlayer2Dob,
        "Male Player 2 Contact Number": data.malePlayer2ContactNumber,
        "Male Player 2 WhatsApp Number": data.malePlayer2WhatsAppNumber,
        "Male Player 2 Address": data.malePlayer2Address,
        "Male Player 2 Employee ID": data.malePlayer2EmployeeId,
        "Male Player 2 Jersey Number": data.malePlayer2JerseyNumber,
        "Male Player 2 Jersey Name": data.malePlayer2JerseyName,
        "Male Player 2 Jersey Size": data.malePlayer2JerseySize,

        "Female Player 1 Name": data.femalePlayer1Name,
        "Female Player 1 Email": data.femalePlayer1Email,
        "Female Player 1 DOB": data.femalePlayer1Dob,
        "Female Player 1 Contact Number": data.femalePlayer1ContactNumber,
        "Female Player 1 WhatsApp Number": data.femalePlayer1WhatsAppNumber,
        "Female Player 1 Address": data.femalePlayer1Address,
        "Female Player 1 Employee ID": data.femalePlayer1EmployeeId,
        "Female Player 1 Jersey Number": data.femalePlayer1JerseyNumber,
        "Female Player 1 Jersey Name": data.femalePlayer1JerseyName,
        "Female Player 1 Jersey Size": data.femalePlayer1JerseySize,

        "Female Player 2 Name": data.femalePlayer2Name,
        "Female Player 2 Email": data.femalePlayer2Email,
        "Female Player 2 DOB": data.femalePlayer2Dob,
        "Female Player 2 Contact Number": data.femalePlayer2ContactNumber,
        "Female Player 2 WhatsApp Number": data.femalePlayer2WhatsAppNumber,
        "Female Player 2 Address": data.femalePlayer2Address,
        "Female Player 2 Employee ID": data.femalePlayer2EmployeeId,
        "Female Player 2 Jersey Number": data.femalePlayer2JerseyNumber,
        "Female Player 2 Jersey Name": data.femalePlayer2JerseyName,
        "Female Player 2 Jersey Size": data.femalePlayer2JerseySize,

        "Transaction ID": data.transactionId,
        "Emergency contact name": data.emergencyContactName,
        "Emergency contact number": data.emergencyContactNumber,
        "Refund UPI ID": data.refundUpiId,
        paymentScreenshotBase64,
      };

      const response = await registerTeam(payload);

      if (response.success) {
        setTeamName(response.data.teamName);
        setModalOpen(true);
        reset();
        setFileName("");
        
        toast({
          title: "Success!",
          description: response.message,
        });
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold neon-text mb-4">
            Team Registration
          </h1>
          <p className="text-gray-400">
            Fill in the details to register your team for the tournament
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            className="glass rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-neon-blue">
              Male Players
            </h2>
            
            <div className="space-y-6">
              <PlayerFields
                prefix="malePlayer1"
                labelPrefix="Male Player 1"
                register={register}
                errors={errors}
              />

              <div className="h-px bg-border/60" />

              <PlayerFields
                prefix="malePlayer2"
                labelPrefix="Male Player 2"
                register={register}
                errors={errors}
              />
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-neon-blue">
              Female Players
            </h2>
            
            <div className="space-y-6">
              <PlayerFields
                prefix="femalePlayer1"
                labelPrefix="Female Player 1"
                register={register}
                errors={errors}
              />

              <div className="h-px bg-border/60" />

              <PlayerFields
                prefix="femalePlayer2"
                labelPrefix="Female Player 2"
                register={register}
                errors={errors}
              />
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="glass rounded-lg p-6 text-center">
                  <div className="w-48 h-48 bg-white rounded-lg border border-border mb-4 overflow-hidden relative mx-auto">
                    <Image
                      src={qrSrc}
                      alt="Payment QR Code"
                      fill
                      sizes="192px"
                      className="object-contain p-2"
                      onError={(e) => {
                        if (qrSrc !== "/qr-code.png") setQrSrc("/qr-code.png");
                        else e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <p className="text-sm text-slate-600">
                    Scan to pay ₹2000
                  </p>
                  <p className="text-neon-blue font-mono mt-2">
                    UPI: coditas@upi
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Payment transaction ID *</Label>
                <Input
                  id="transactionId"
                  {...register("transactionId")}
                  className={errors.transactionId ? "border-red-500" : ""}
                />
                {errors.transactionId && (
                  <p className="text-red-500 text-sm">
                    {errors.transactionId.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency contact name *</Label>
                  <Input
                    id="emergencyContactName"
                    {...register("emergencyContactName")}
                    className={errors.emergencyContactName ? "border-red-500" : ""}
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-500 text-sm">
                      {errors.emergencyContactName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactNumber">Emergency contact number *</Label>
                  {(() => {
                    const emergency_register = register("emergencyContactNumber");
                    return (
                      <Input
                        id="emergencyContactNumber"
                        inputMode="numeric"
                        maxLength={10}
                        {...emergency_register}
                        onChange={(e) => {
                          const digits_only = e.target.value.replace(/\D/g, "");
                          e.target.value = digits_only.slice(0, 10);
                          emergency_register.onChange(e);
                        }}
                        className={errors.emergencyContactNumber ? "border-red-500" : ""}
                      />
                    );
                  })()}
                  {errors.emergencyContactNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.emergencyContactNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundUpiId">Refund UPI ID *</Label>
                <Input
                  id="refundUpiId"
                  {...register("refundUpiId")}
                  className={errors.refundUpiId ? "border-red-500" : ""}
                />
                {errors.refundUpiId && (
                  <p className="text-red-500 text-sm">
                    {errors.refundUpiId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentProof">Payment Screenshot (PNG, JPG, JPEG) *</Label>
                <div className="space-y-3">
                  {(() => {
                    const paymentProofRegister = register("paymentProof");

                    return (
                      <>
                        <Input
                          id="paymentProof"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="sr-only"
                          {...paymentProofRegister}
                          ref={(el) => {
                            paymentProofRegister.ref(el);
                            paymentProofInputRef.current = el;
                          }}
                          onChange={(e) => {
                            paymentProofRegister.onChange(e);
                            const file = e.target.files?.[0];
                            setFileName(file ? file.name : "");
                          }}
                        />

                        <div className="flex">
                          <Button
                            type="button"
                            variant="outline"
                            className={errors.paymentProof ? "border-red-500" : ""}
                            onClick={() => paymentProofInputRef.current?.click()}
                          >
                            Choose file
                          </Button>
                        </div>

                        {fileName ? (
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 max-w-full">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span className="truncate max-w-[240px]">{fileName}</span>
                            </div>

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                              onClick={() => {
                                setFileName("");
                                resetField("paymentProof");
                                if (paymentProofInputRef.current) paymentProofInputRef.current.value = "";
                              }}
                            >
                              <X className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">
                            No file selected
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
                {errors.paymentProof && (
                  <p className="text-red-500 text-sm">
                    {errors.paymentProof.message as string}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="neon"
              size="lg"
              className="w-full md:w-auto min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Team"
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>

      <TeamRevealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        teamName={teamName}
      />
    </div>
  );
}
