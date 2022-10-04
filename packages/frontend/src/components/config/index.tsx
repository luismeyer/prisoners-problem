import { useAtom } from "jotai";
import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSimulation } from "../../context/simulation";

import { Config as ConfigType, configAtom } from "../../store/config";
import * as S from "./styled";

export const Config: FC = () => {
  const simulation = useSimulation();

  const [config, setConfig] = useAtom(configAtom);

  const { register, handleSubmit } = useForm<ConfigType>({
    defaultValues: config,
    mode: "onChange",
  });

  const onChange = useCallback(
    (values: ConfigType) => {
      setConfig({
        ...config,

        ...values,
        problemCount: Number(values.problemCount),
        simulationCount: Number(values.simulationCount),
        simulationSpeed: Number(values.simulationSpeed),
      });
    },
    [config]
  );

  const configDisabled = simulation.status !== "setup";

  return (
    <S.Container>
      <S.Form onChange={handleSubmit(onChange)}>
        <S.FormField>
          <label>Strategy</label>
          <input type="text" disabled={configDisabled} {...register("strategy")} />
        </S.FormField>

        <S.FormField>
          <label>Problem Count</label>
          <input type="number" disabled={configDisabled} {...register("problemCount")} />
        </S.FormField>

        <S.FormField>
          <label>Simulations Count</label>
          <input type="number" disabled={configDisabled} {...register("simulationCount")} />
        </S.FormField>

        <S.FormField>
          <label>Simulations Speed</label>
          <input type="number" disabled={configDisabled} {...register("simulationSpeed")} />
        </S.FormField>
      </S.Form>

      <S.FormField>
        <label>UI aktiviert</label>
        <button disabled={configDisabled} onClick={() => setConfig({ ...config, ui: !config.ui })}>
          {config.ui ? "deactivate" : "activate"}
        </button>
      </S.FormField>
    </S.Container>
  );
};
