import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { apiService } from "@/service/api";
import { motion } from "framer-motion";
import { blog } from "@/utils";

const schema = yup.object().shape({
  name: yup.string().required("企业名称是必填项"),
  description: yup.string().required("企业描述是必填项"),
  organizationCode: yup.string().required("组织代码是必填项"),
  abbreviation: yup.string().required("企业简称是必填项"),
});

type FormData = {
  name: string;
  description: string;
  organizationCode: string;
  abbreviation: string;
};

const OrganizationSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const response = await apiService.get("/api/organizations/self/detail");
        reset(response.data);
      } catch (error) {
        console.log("Failed to fetch organization details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await apiService.put("/api/organizations/self", data);
      console.log("Organization updated successfully");
    } catch (error) {
      console.log("Failed to update organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 w-full"
    >
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold">企业设置</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="企业名称"
                  variant="bordered"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="企业描述"
                  variant="bordered"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                />
              )}
            />
            <Controller
              name="organizationCode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="组织代码"
                  variant="bordered"
                  isInvalid={!!errors.organizationCode}
                  errorMessage={errors.organizationCode?.message}
                />
              )}
            />
            <Controller
              name="abbreviation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="企业简称"
                  variant="bordered"
                  isInvalid={!!errors.abbreviation}
                  errorMessage={errors.abbreviation?.message}
                />
              )}
            />
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full"
            >
              更新
            </Button>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default OrganizationSettings;
