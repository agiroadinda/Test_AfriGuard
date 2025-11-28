import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function Settings() {
  const [language, setLanguage] = useState('english');
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [heatmapsEnabled, setHeatmapsEnabled] = useState(true);
  const [verboseExplanations, setVerboseExplanations] = useState(true);

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your verification preferences</p>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language for the interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">Interface Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="swahili">Swahili</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
          <CardDescription>Adjust how verification results are processed and displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="confidence" className="text-base">
                Confidence Threshold
              </Label>
              <span className="text-sm font-medium text-muted-foreground">
                {confidenceThreshold[0]}%
              </span>
            </div>
            <Slider
              id="confidence"
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Cases with confidence above this threshold will be flagged as high-risk deepfakes
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="heatmaps" className="text-base">
                Enable Heatmap Visualizations
              </Label>
              <p className="text-sm text-muted-foreground">
                Show visual heatmaps highlighting manipulated regions
              </p>
            </div>
            <Switch
              id="heatmaps"
              checked={heatmapsEnabled}
              onCheckedChange={setHeatmapsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verbose" className="text-base">
                Verbose Explanations
              </Label>
              <p className="text-sm text-muted-foreground">
                Provide detailed AI-generated explanations for each analysis
              </p>
            </div>
            <Switch
              id="verbose"
              checked={verboseExplanations}
              onCheckedChange={setVerboseExplanations}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
