import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CopyShareContentButton } from "./copy-share-button";
import { Skeleton } from "./ui/skeleton";

export function ShareViewCardSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <CopyShareContentButton share={null} />
      </CardFooter>
    </Card>
  );
}
