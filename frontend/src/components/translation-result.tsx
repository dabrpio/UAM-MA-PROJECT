import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface TranslationResult {
  translation: string;
  few_shots: null | { text: string; translation: string; score: number }[];
}

interface TranslationResultProps {
  result: TranslationResult;
}

export const TranslationResult = ({ result }: TranslationResultProps) => {
  const shots = result.few_shots ? result.few_shots.length : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-lg">{shots}-shot translation:</div>
          <div className="text-md font-normal">{result.translation}</div>
        </CardTitle>
      </CardHeader>

      {result.few_shots && (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">Id</TableHead>
                <TableHead>Text</TableHead>
                <TableHead>Translation</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.few_shots?.map((shot, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{shot.text}</TableCell>
                  <TableCell>{shot.translation}</TableCell>
                  <TableCell className="text-right">
                    {shot.score.toPrecision(4)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};
