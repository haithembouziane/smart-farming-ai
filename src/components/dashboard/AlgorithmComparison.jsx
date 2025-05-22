import { useState } from 'react';
import { BarChart, ArrowRight, Clock, Database } from 'lucide-react';

const AlgorithmComparison = () => {
  const [selectedMetric, setSelectedMetric] = useState('time');

  const algorithmStats = {
    astar: {
      time: { avg: 2.5, best: 1.8, worst: 4.2 },
      space: { avg: 450, best: 380, worst: 520 },
      description: "A* provides optimal solutions but may require more memory for complex scenarios."
    },
    genetic: {
      time: { avg: 3.8, best: 2.5, worst: 6.1 },
      space: { avg: 380, best: 320, worst: 450 },
      description: "Genetic algorithms excel at finding good solutions in large search spaces."
    },
    csp: {
      time: { avg: 1.9, best: 1.2, worst: 3.5 },
      space: { avg: 290, best: 250, worst: 350 },
      description: "CSP is efficient for problems with clear constraints and moderate complexity."
    },
    greedy: {
      time: { avg: 1.2, best: 0.8, worst: 2.1 },
      space: { avg: 220, best: 180, worst: 280 },
      description: "Greedy search provides fast solutions but may not always find the optimal result."
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <BarChart className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Algorithm Comparison</h2>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedMetric('time')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            selectedMetric === 'time'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          <Clock className="h-4 w-4 mr-2" />
          Time Complexity
        </button>
        <button
          onClick={() => setSelectedMetric('space')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            selectedMetric === 'space'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          <Database className="h-4 w-4 mr-2" />
          Space Usage
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(algorithmStats).map(([algo, stats]) => (
          <div key={algo} className="border dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {algo === 'astar' ? 'A* Search' : algo.charAt(0).toUpperCase() + algo.slice(1)}
              </h3>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400 mr-2">Complexity:</span>
                <span className="font-mono text-primary-600 dark:text-primary-400">
                  {algo === 'astar' ? 'O(b^d)' : 
                   algo === 'genetic' ? 'O(g*n*m)' :
                   algo === 'csp' ? 'O(d^n)' : 'O(n)'}
                </span>
              </div>
            </div>

            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary-500 dark:bg-primary-600 rounded-full transition-all"
                style={{
                  width: `${(stats[selectedMetric].avg / 
                    Math.max(...Object.values(algorithmStats).map(s => s[selectedMetric].avg))) * 100}%`
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Best Case</p>
                <p className="font-semibold text-success-600 dark:text-success-400">
                  {stats[selectedMetric].best} {selectedMetric === 'time' ? 'ms' : 'MB'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Average</p>
                <p className="font-semibold text-primary-600 dark:text-primary-400">
                  {stats[selectedMetric].avg} {selectedMetric === 'time' ? 'ms' : 'MB'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Worst Case</p>
                <p className="font-semibold text-error-600 dark:text-error-400">
                  {stats[selectedMetric].worst} {selectedMetric === 'time' ? 'ms' : 'MB'}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {stats.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmComparison;