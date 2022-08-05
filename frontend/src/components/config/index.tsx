import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { useForm } from "react-hook-form";

import { Config as ConfigType, configAtom } from "../../store/config";
import { simulationStateAtom } from "../../store/simulation";
import * as S from "./styled";

type FormFields = Pick<
  ConfigType,
  "inmateCount" | "strategy" | "simulationCount"
>;

export const Config: FC = () => {
  const [config, setConfig] = useAtom(configAtom);

  const simulation = useAtomValue(simulationStateAtom);

  const { register, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      inmateCount: config.inmateCount,
      simulationCount: config.simulationCount,
      strategy: config.strategy,
    },
    mode: "onChange",
  });

  const onChange = (values: FormFields) => {
    setConfig({ ...config, ...values });
  };

  const configDisabled = simulation !== "setup";

  return (
    <S.Container>
      <S.Form onChange={handleSubmit(onChange)}>
        <S.FormField>
          <label>Strategie</label>
          <input
            type="text"
            disabled={configDisabled}
            {...register("strategy")}
          />
        </S.FormField>

        <S.FormField>
          <label>Gefangene</label>
          <input
            type="number"
            disabled={configDisabled}
            {...register("inmateCount")}
          />
        </S.FormField>

        <S.FormField>
          <label>Simulations Runden</label>
          <input
            type="number"
            disabled={configDisabled}
            {...register("simulationCount")}
          />
        </S.FormField>
      </S.Form>

      <S.FormField>
        <label>UI aktiviert</label>
        <button
          disabled={configDisabled}
          onClick={() => setConfig({ ...config, ui: !config.ui })}
        >
          {config.ui ? "deactivate" : "activate"}
        </button>
      </S.FormField>
    </S.Container>
  );
};
