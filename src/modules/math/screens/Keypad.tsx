import { Button } from "../../../shared/components/Button";
import type { Tone } from "../types";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Keypad({
  isMoney,
  disabled,
  onDigit,
  onComma,
  onBackspace,
  onSubmit,
  submitDisabled,
  submitLabel = "Confirmar",
  tone,
}: {
  isMoney: boolean;
  disabled: boolean;
  onDigit: (digit: string) => void;
  onComma?: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitLabel?: string;
  tone: Tone;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2.5">
        {DIGITS.map((d) => (
          <Button
            key={d}
            type="button"
            tone="ink"
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => onDigit(d)}
            className="text-xl"
          >
            {d}
          </Button>
        ))}
        {isMoney && onComma ? (
          <Button type="button" tone="ink" variant="outline" size="lg" disabled={disabled} onClick={onComma} className="text-xl">
            ,
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
        <Button type="button" tone="ink" variant="outline" size="lg" disabled={disabled} onClick={() => onDigit("0")} className="text-xl">
          0
        </Button>
        <Button
          type="button"
          tone="ink"
          variant="outline"
          size="lg"
          disabled={disabled}
          onClick={onBackspace}
          aria-label="Apagar"
          className="text-xl"
        >
          ⌫
        </Button>
      </div>
      <Button type="button" tone={tone} size="lg" disabled={disabled || submitDisabled} onClick={onSubmit} className="w-full">
        {submitLabel} ✓
      </Button>
    </div>
  );
}
